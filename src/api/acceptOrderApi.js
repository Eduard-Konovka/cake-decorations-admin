import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function acceptOrderApi(orderId, type) {
  try {
    await updateDoc(doc(db, 'orders', orderId), { type });

    // FIXME
    toast.success(`Замовлення прийнято в роботу`);
  } catch (error) {
    // FIXME
    toast.error(`Помилка прийняття замовлення на оформлення: ${error}`);
  }
}
