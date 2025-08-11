import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define interface with password as optional (because of select: false)
interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(date: Date) {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 18 && age <= 100;
      },
      message: 'Must be between 18 and 100 years old'
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete (ret as any).__v;  // ← Fix: Cast ret as any to access __v
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Handle duplicate email error
userSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else {
    next(error);
  }
});

export default mongoose.model<IUser>('User', userSchema);
export { IUser };