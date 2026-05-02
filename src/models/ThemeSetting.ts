import mongoose, { Document, Schema } from "mongoose";

export interface IThemeSetting extends Document {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultMode: "light" | "dark";
  updatedAt: Date;
}

const ThemeSettingSchema = new Schema<IThemeSetting>(
  {
    primaryColor: {
      type: String,
      default: "#6366f1", // Indigo
    },
    secondaryColor: {
      type: String,
      default: "#8b5cf6", // Violet
    },
    accentColor: {
      type: String,
      default: "#06b6d4", // Cyan
    },
    defaultMode: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
  },
  {
    timestamps: true,
  }
);

const ThemeSetting =
  mongoose.models.ThemeSetting ||
  mongoose.model<IThemeSetting>("ThemeSetting", ThemeSettingSchema);

export default ThemeSetting;
