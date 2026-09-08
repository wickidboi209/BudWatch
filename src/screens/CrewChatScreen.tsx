import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { CrewMessage, getCrewMessages, hydrateMessageRow, sendCrewMessage, subscribeToCrewMessages } from "../services/crewChat";
import { RootStackParamList } from "../navigation/types";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type CrewChatScreenProps = NativeStackScreenProps<RootStackParamList, "CrewChat">;

function timeLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function CrewChatScreen({ navigation, route }: CrewChatScreenProps) {
  const { user } = useAuth();
  const { crewId, crewName } = route.params;

  const [messages, setMessages] = useState<CrewMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<CrewMessage>>(null);

  const appendMessage = useCallback((message: CrewMessage) => {
    setMessages((current) => (current.some((existing) => existing.id === message.id) ? current : [...current, message]));
  }, []);

  useFocusEffect(useCallback(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    getCrewMessages(crewId)
      .then((result) => { if (isCurrent) setMessages(result); })
      .catch((requestError: unknown) => { if (isCurrent) setError(requestError instanceof Error ? requestError.message : "Unable to load this crew's chat right now."); })
      .finally(() => { if (isCurrent) setIsLoading(false); });

    const channel = subscribeToCrewMessages(crewId, (row) => {
      void hydrateMessageRow(row).then((message) => { if (isCurrent) appendMessage(message); });
    });

    return () => { isCurrent = false; channel.unsubscribe(); };
  }, [appendMessage, crewId]));

  useEffect(() => {
    if (messages.length) requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, [messages.length]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || isSending) return;
    setIsSending(true);
    setDraft("");
    try {
      const message = await sendCrewMessage(crewId, body);
      appendMessage(message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send your message.");
      setDraft(body);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons color={Colors.text} name="arrow-back" size={22} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{crewName}</Text>
        <View style={styles.iconButton} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0} style={styles.flex}>
        {isLoading ? (
          <View style={styles.state}><ActivityIndicator color={Colors.primary} /></View>
        ) : (
          <FlatList
            contentContainerStyle={styles.messages}
            data={messages}
            keyExtractor={(message) => message.id}
            ListEmptyComponent={<View style={styles.state}>
              <View style={styles.mark}><Ionicons color={Colors.text} name="chatbubbles-outline" size={26} /></View>
              <Text style={styles.stateTitle}>No messages yet.</Text>
              <Text style={styles.stateText}>Say something to {crewName}.</Text>
            </View>}
            ref={listRef}
            renderItem={({ item }) => <MessageBubble isOwn={item.userId === user?.id} message={item} />}
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputBar}>
          <TextInput
            accessibilityLabel="Message your crew"
            multiline
            onChangeText={setDraft}
            placeholder="Message your crew..."
            placeholderTextColor={Colors.textSecondary}
            style={styles.input}
            value={draft}
          />
          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            disabled={isSending || !draft.trim()}
            onPress={() => void handleSend()}
            style={({ pressed }) => [styles.sendButton, (pressed || isSending || !draft.trim()) && styles.pressed]}
          >
            {isSending ? <ActivityIndicator color={Colors.background} /> : <Ionicons color={Colors.background} name="arrow-up" size={18} />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ isOwn, message }: { isOwn: boolean; message: CrewMessage }) {
  return (
    <View style={[styles.bubbleRow, isOwn && styles.bubbleRowOwn]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {!isOwn ? <Text style={styles.bubbleUsername}>{message.username}</Text> : null}
        <Text style={[styles.bubbleBody, isOwn && styles.bubbleBodyOwn]}>{message.body}</Text>
        <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>{timeLabel(message.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  flex: { flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: Spacing.md, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  iconButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
  title: { color: Colors.text, ...Typography.heading, flex: 1, fontWeight: "700", textAlign: "center" },
  state: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl, paddingTop: Spacing.xxxl },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  stateTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  stateText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
  messages: { flexGrow: 1, gap: Spacing.md, padding: Spacing.xl },
  bubbleRow: { flexDirection: "row" },
  bubbleRowOwn: { justifyContent: "flex-end" },
  bubble: { borderRadius: Radius.lg, maxWidth: "80%", paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  bubbleOther: { backgroundColor: Colors.surface, borderColor: Colors.hairline, borderWidth: 1 },
  bubbleOwn: { backgroundColor: Colors.primary },
  bubbleUsername: { color: Colors.textSecondary, ...Typography.label, fontWeight: "700", marginBottom: Spacing.xs },
  bubbleBody: { color: Colors.text, ...Typography.body },
  bubbleBodyOwn: { color: Colors.background },
  bubbleTime: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  bubbleTimeOwn: { color: Colors.background, opacity: 0.65 },
  error: { color: Colors.danger, ...Typography.label, paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  inputBar: { alignItems: "flex-end", borderTopColor: Colors.hairline, borderTopWidth: 1, flexDirection: "row", gap: Spacing.sm, padding: Spacing.lg },
  input: { backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, color: Colors.text, flex: 1, ...Typography.body, maxHeight: 120, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  sendButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, height: 46, justifyContent: "center", width: 46 },
  pressed: { opacity: 0.6 },
});
