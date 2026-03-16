import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  location?: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
  },
  { timestamps: true }
)

userSchema.index({ location: "2dsphere" })

const User = models.User || model<IUser>("User", userSchema)

export default User
