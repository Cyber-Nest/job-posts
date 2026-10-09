import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    accountId: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: String,
    refreshToken: String,
    idToken: String,
    accessTokenExpiresAt: Date,
    refreshTokenExpiresAt: Date,
    scope: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

AccountSchema.index({ userId: 1 });
AccountSchema.index({ providerId: 1, accountId: 1 });

export const Account = models.Account || model("Account", AccountSchema);
