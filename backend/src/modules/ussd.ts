import { Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';

// USSD Endpoint (Africa's Talking format)
export const handleUSSD = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  
  // text is a string of inputs separated by '*'
  const inputs = text ? text.split('*') : [];
  let response = '';

  const db = getFirestore();

  try {
    if (inputs.length === 0 || text === '') {
      response = `CON Welcome to Eventnic Awards Voting.
Please enter the 4-character Event Code:`;
    } 
    else if (inputs.length === 1) {
      const eventCode = inputs[0].toUpperCase();
      
      // Fetch events to find matching prefix
      const eventsSnap = await db.collection('events').where('votingEnabled', '==', true).get();
      let matchedEvent: any = null;
      eventsSnap.forEach(doc => {
        if (doc.id.toUpperCase().startsWith(eventCode)) {
          matchedEvent = doc.data();
        }
      });

      if (!matchedEvent) {
        response = `END Event not found. Please check the code and try again.`;
      } else {
        response = `CON Event: ${matchedEvent.title.substring(0, 20)}
Enter the 4-character Nominee Code:`;
      }
    }
    else if (inputs.length === 2) {
      const eventCode = inputs[0].toUpperCase();
      const nomineeCode = inputs[1].toUpperCase();

      const eventsSnap = await db.collection('events').where('votingEnabled', '==', true).get();
      let matchedEvent: any = null;
      let matchedNominee: any = null;
      let matchedCategory: any = null;

      eventsSnap.forEach(doc => {
        if (doc.id.toUpperCase().startsWith(eventCode)) matchedEvent = doc.data();
      });

      if (!matchedEvent) {
        response = `END Event not found.`;
      } else {
        for (const cat of matchedEvent.votingCategories || []) {
          for (const nom of cat.nominees || []) {
            if (nom.id.toUpperCase().startsWith(nomineeCode)) {
              matchedNominee = nom;
              matchedCategory = cat;
              break;
            }
          }
        }

        if (!matchedNominee) {
          response = `END Nominee not found for this event.`;
        } else {
          response = `CON Nominee: ${matchedNominee.name.substring(0, 20)}
Price: $${matchedEvent.votePrice}/vote
How many votes do you want to cast?`;
        }
      }
    }
    else if (inputs.length === 3) {
      const eventCode = inputs[0].toUpperCase();
      const nomineeCode = inputs[1].toUpperCase();
      const voteCount = parseInt(inputs[2], 10);

      if (isNaN(voteCount) || voteCount < 1) {
        response = `END Invalid number of votes.`;
      } else {
        const eventsSnap = await db.collection('events').where('votingEnabled', '==', true).get();
        let matchedEvent: any = null;
        let matchedNominee: any = null;
        let matchedCategory: any = null;

        eventsSnap.forEach(doc => {
          if (doc.id.toUpperCase().startsWith(eventCode)) matchedEvent = doc.data();
        });

        if (matchedEvent) {
          for (const cat of matchedEvent.votingCategories || []) {
            for (const nom of cat.nominees || []) {
              if (nom.id.toUpperCase().startsWith(nomineeCode)) {
                matchedNominee = nom;
                matchedCategory = cat;
                break;
              }
            }
          }
        }

        if (!matchedEvent || !matchedNominee) {
          response = `END Error verifying nominee or event.`;
        } else {
          const totalCost = voteCount * (matchedEvent.votePrice || 0);
          
          const voteId = `ussd_${sessionId}`;
          await db.collection('votes').doc(voteId).set({
            id: voteId,
            eventId: matchedEvent.id,
            categoryId: matchedCategory.id,
            nomineeId: matchedNominee.id,
            voterId: phoneNumber,
            quantity: voteCount,
            source: 'USSD',
            createdAt: Date.now()
          });

          // Normally trigger STK Push here for totalCost
          response = `END Success! You cast ${voteCount} vote(s) for ${matchedNominee.name}.
Total: $${totalCost}. Look out for payment prompt.`;
        }
      }
    }
    else {
      response = `END Invalid input.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);

  } catch (error) {
    console.error('USSD Error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END An error occurred. Please try again.');
  }
};
