import { firestore } from './firebase';
import { collection, query, getDocs } from '@firebase/firestore';
import { Record } from './Record';

const ref = collection(firestore, 'clients');
const queryToGetRecords = query(ref);

const getUsersRecord = async () => {
  const usersRecords: Record[] = [];

  (await getDocs(queryToGetRecords)).forEach((doc) => {
    const { board_ID, username, api_key } = doc.data();

    if (board_ID && username && api_key) {
      usersRecords.push({ board_ID, username, api_key });
    }
  });
  return usersRecords;
};

export default getUsersRecord;
