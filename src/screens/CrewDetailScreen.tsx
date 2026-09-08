import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityFeed } from "../components/social/ActivityFeed";
import { useAuth } from "../hooks/useAuth";
import { CommunityActivity, deleteExperience } from "../services/experiences";
import { Crew, CrewMember, getCrewActivityFeed, getCrewMembers, getMyCrews, leaveCrew } from "../services/crews";
import { RootStackParamList } from "../navigation/types";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type CrewDetailScreenProps = NativeStackScreenProps<RootStackParamList, "CrewDetail">;

export default function CrewDetailScreen({ navigation, route }: CrewDetailScreenProps) {
  const { user } = useAuth();
  const { crewId, crewName } = route.params;

  const [crew, setCrew] = useState<Crew | null>(null);
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    setError(null);
    Promise.all([getMyCrews(), getCrewMembers(crewId), getCrewActivityFeed(crewId)])
      .then(([crews, memberList, feed]) => {
        setCrew(crews.find((item) => item.id === crewId) ?? null);
        setMembers(memberList);
        setActivities(feed);
      })
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "Unable to load this crew right now."))
      .finally(() => { setIsLoading(false); setIsRefreshing(false); });
  }, [crewId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleEdit = (activity: CommunityActivity) => {
    navigation.navigate("ExperienceForm", {
      movieId: activity.movie.id,
      movieTitle: activity.movie.title,
      editExperience: { id: activity.id, budScore: activity.budScore, mood: activity.mood, notes: activity.notes, containsSpoilers: activity.containsSpoilers },
    });
  };

  const handleDelete = (activity: CommunityActivity) => {
    setActivities((current) => current.filter((item) => item.id !== activity.id));
    deleteExperience(activity.id).catch(() => load());
  };

  const shareInvite = () => {
    if (!crew) return;
    void Share.share({ message: `Join my crew "${crew.name}" on BudWatch with the invite code ${crew.inviteCode}.` });
  };

  const confirmLeave = () => {
    Alert.alert("Leave this crew?", `You'll stop seeing ${crewName}'s feed until you rejoin with the invite code.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => { void leaveCrew(crewId).then(() => navigation.goBack()); },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons color={Colors.text} name="arrow-back" size={22} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{crewName}</Text>
        <Pressable accessibilityLabel="Leave crew" accessibilityRole="button" hitSlop={Spacing.sm} onPress={confirmLeave} style={styles.iconButton}>
          <Ionicons color={Colors.danger} name="exit-outline" size={20} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.state}><ActivityIndicator color={Colors.primary} /></View>
      ) : error ? (
        <View style={styles.state}><Text style={styles.stateTitle}>Couldn't load this crew</Text><Text style={styles.stateText}>{error}</Text></View>
      ) : (
        <ActivityFeed
          activities={activities}
          currentUserId={user?.id}
          ListEmptyComponent={<View style={styles.state}>
            <View style={styles.mark}><Ionicons color={Colors.text} name="film" size={26} /></View>
            <Text style={styles.stateTitle}>No activity yet.</Text>
            <Text style={styles.stateText}>When a crew member logs a movie, it'll show up here.</Text>
          </View>}
          ListHeaderComponent={
            <View style={styles.summary}>
              {crew ? (
                <Pressable accessibilityRole="button" onPress={shareInvite} style={styles.inviteRow}>
                  <Ionicons color={Colors.textSecondary} name="key-outline" size={16} />
                  <Text style={styles.inviteText}>Invite code {crew.inviteCode}</Text>
                  <Ionicons color={Colors.textSecondary} name="share-outline" size={16} />
                </Pressable>
              ) : null}
              <ScrollView contentContainerStyle={styles.membersRow} horizontal showsHorizontalScrollIndicator={false}>
                {members.map((member) => (
                  <View key={member.userId} style={styles.memberChip}>
                    <View style={styles.memberAvatar}><Ionicons color={Colors.textSecondary} name="person" size={14} /></View>
                    <Text numberOfLines={1} style={styles.memberName}>{member.username}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          }
          onDelete={handleDelete}
          onEdit={handleEdit}
          onRefresh={() => load(true)}
          refreshing={isRefreshing}
          tabBarClearance={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: Spacing.md, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  iconButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
  title: { color: Colors.text, ...Typography.heading, flex: 1, fontWeight: "700", textAlign: "center" },
  state: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl, paddingTop: Spacing.xxxl * 2 },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  stateTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  stateText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
  summary: { marginBottom: Spacing.lg },
  inviteRow: { alignItems: "center", alignSelf: "flex-start", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, flexDirection: "row", gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  inviteText: { color: Colors.textSecondary, ...Typography.label, fontWeight: "600" },
  membersRow: { gap: Spacing.sm, marginTop: Spacing.lg },
  memberChip: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, flexDirection: "row", gap: Spacing.xs, maxWidth: 140, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  memberAvatar: { alignItems: "center", backgroundColor: Colors.surfaceElevated, borderRadius: Radius.pill, height: 22, justifyContent: "center", width: 22 },
  memberName: { color: Colors.text, ...Typography.label, fontWeight: "600" },
});
