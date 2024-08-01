import mongoose, { Document } from 'mongoose';

export interface IAdmin extends mongoose.Document {
  username: string;
  password: string;
}

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;