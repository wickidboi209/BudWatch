import { Platform } from "react-native";
import { Colors } from "./colors";

export const Shadows = {
	card: Platform.select({
		android: { elevation: 5 },
		default: { shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.24, shadowRadius: 12 },
	}),
	cardPressed: Platform.select({
		android: { elevation: 9 },
		default: { shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.34, shadowRadius: 16 },
	}),
	hero: Platform.select({
		android: { elevation: 8 },
		default: { shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 18 },
	}),
};
