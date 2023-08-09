import { getDatabase, ref, set,get,update,remove,push } from "firebase/database";
import {firebaseDb} from '../config/firebase.js';
const database = getDatabase(firebaseDb);

class Notifications {
  constructor(feed, content, createAt) {
    this.feed = feed;
    this.content = content;
    this.createAt = createAt;
  }
  toString() {
    return JSON.stringify({
      feed: this.feed,
      content: this.content,
      createAt: this.createAt
    });
  }
  static fromSnapshot(snapshot) {
    const data = snapshot.val();
    return new Notifications(data.feed, data.content, data.createAt);
  }

  static async getById(Id) {
    const getid = ref(database, 'notifications/' + Id);
    const snapshot = await get(getid)
    return this.fromSnapshot(snapshot)
  }

  async save() {
    try {
      await push(ref(database,'notifications'),{
        feed: this.feed,
        content: this.content,
        createAt: this.createAt
      });
    } catch (error) {
      throw new Error(`Error saving notification: ${error}`);
    }
  }

  // async update() {
  //   try {
  //     await update(ref(database, 'notifications/' + this.id), {
  //       feed: this.feed,
  //       content: this.content,
  //       createAt: this.createAt
  //     });
  //     console.log("successfully updated notification")
  //   } catch (error) {
  //     throw new Error(`Error updating user with ID: ${this.id}. ${error}`);
  //   }
  // }
  //
  // async delete() {
  //   try {
  //     await remove(ref(database, 'notifications/' + this.id))
  //     console.log("successfully deleted")
  //   } catch (error) {
  //     throw new Error(`Error deleting notification with ID: ${this.id}. ${error}`);
  //   }
  // }
}

export default Notifications;