import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { WatchProviders as WatchProvidersData } from "../../services/tmdb";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type WatchProvidersProps = { providers: WatchProvidersData };

export function WatchProviders({ providers }: WatchProvidersProps) {
  const streaming = providers.stream;
  const payPerView = [...providers.rent, ...providers.buy].filter((provider, index, all) => all.findIndex((other) => other.id === provider.id) === index);

  if (!streaming.length && !payPerView.length) return null;

  return (
    <View>
      {streaming.length ? <ProviderRow label="Stream on" providers={streaming} /> : null}
      {payPerView.length ? <ProviderRow label="Rent or buy" providers={payPerView} /> : null}
      {providers.link ? (
        <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(providers.link!)} style={styles.link}>
          <Text style={styles.linkText}>See all options</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ProviderRow({ label, providers }: { label: string; providers: WatchProvidersData["stream"] }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.logos}>
        {providers.map((provider) => (
          <Image accessibilityLabel={provider.name} key={provider.id} source={{ uri: provider.logoUrl }} style={styles.logo} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: Spacing.md },
  label: { color: Colors.textSecondary, ...Typography.label, marginBottom: Spacing.sm },
  logos: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  logo: { borderColor: Colors.hairline, borderRadius: Radius.sm, borderWidth: 1, height: 44, width: 44 },
  link: { marginTop: Spacing.md },
  linkText: { color: Colors.primary, ...Typography.body, fontWeight: "700" },
});
