import { firestore } from './firebase';
import { collection, query, getDocs } from '@firebase/firestore';
const ref = collection(firestore, 'clients');
type Record = { board_ID: string; username: string; api_key: string };
const allData: Record[] = [];

const getData = async () => {
  const q = query(ref);

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    if (data.board_ID && data.username && data.api_key) {
      allData.push({
        board_ID: data.board_ID,
        username: data.username,
        api_key: data.api_key,
      });
    }
  });
  return allData;
};

export default getData();
