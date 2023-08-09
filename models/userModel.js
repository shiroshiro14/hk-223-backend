
import { getDatabase, ref, set,get,update,remove } from "firebase/database";
import {firebaseDb} from '../config/firebase.js';
const database = getDatabase(firebaseDb);

class Users {
    constructor(id, email, name, avatar, phoneNumber) {
      this.id = id;
      this.email = email;
      this.name = name;
      this.avatar = avatar;
      this.phoneNumber = phoneNumber;
    }
    toString() {
      return JSON.stringify({
        id: this.id,
        email: this.email,
        name: this.name,
        avatar: this.avatar,
        phoneNumber: this.phoneNumber,
      });
    }
    static fromSnapshot(snapshot) {
      const data = snapshot.val();
      return new Users(snapshot.key, data.email, data.username, data.profile_picture, data.phoneNumber);
    }
  
    static async getById(userId) {
      const getid = ref(database, 'users/' + userId);
      const snapshot = await get(getid)
      return this.fromSnapshot(snapshot)
    }
  
    async save() {
      try {
      await set(ref(database, 'users/' + this.id), {
        username: this.name,
        email: this.email,
        profile_picture : this.avatar,
        phoneNumber: this.phoneNumber,
      });      
      } catch (error) {
        throw new Error(`Error saving user with ID: ${this.id}. ${error}`);
      }
    }
  
    async update() {
      try {
        await update(ref(database, 'users/' + this.id), {
          username: this.name,
          email: this.email,
          profile_picture : this.avatar,
          phoneNumber: this.phoneNumber,
        });  
        console.log("successfully updated user")
      } catch (error) {
        throw new Error(`Error updating user with ID: ${this.id}. ${error}`);
      }
    }
  
    async delete() {
      try {
        await remove(ref(database, 'users/' + this.id))
        console.log("successfully deleted")
      } catch (error) {
        throw new Error(`Error deleting user with ID: ${this.id}. ${error}`);
      }
    }
  }

export default Users