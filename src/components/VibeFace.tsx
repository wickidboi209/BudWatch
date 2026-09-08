import { Circle, Path, Svg } from "react-native-svg";

type VibeFaceProps = { vibeId: string; size?: number; color?: string };

export function VibeFace({ color = "#FFFFFF", size = 32, vibeId }: VibeFaceProps) {
  const stroke = color;
  const common = { fill: "none", stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 6 };

  return (
    <Svg height={size} viewBox="0 0 100 100" width={size}>
      {renderFace(vibeId, stroke, common)}
    </Svg>
  );
}

function renderFace(vibeId: string, stroke: string, common: { fill: string; stroke: string; strokeLinecap: "round"; strokeLinejoin: "round"; strokeWidth: number }) {
  switch (vibeId) {
    case "lock-in":
      // narrowed, focused eyes + flat determined mouth
      return <>
        <Path d="M26 45 L44 45" {...common} />
        <Path d="M56 45 L74 45" {...common} />
        <Path d="M36 66 L64 66" {...common} />
      </>;

    case "main-character":
      // sunglasses + confident smirk
      return <>
        <Path d="M22 40 h22 a4 4 0 0 1 4 4 v6 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 v-6 a4 4 0 0 1 -8 0" {...common} strokeWidth={5} />
        <Path d="M56 44 h22 a4 4 0 0 1 4 4 v6 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 v-6 a4 4 0 0 1 -8 -6" {...common} strokeWidth={5} />
        <Path d="M38 64 Q50 70 62 60" {...common} />
      </>;

    case "in-my-feels":
      // gentle downturned eyes + teardrop + soft mouth
      return <>
        <Path d="M28 42 Q35 50 42 42" {...common} />
        <Path d="M58 42 Q65 50 72 42" {...common} />
        <Path d="M28 50 Q22 60 28 64 Q34 60 28 50 Z" fill={stroke} stroke="none" />
        <Path d="M38 66 Q50 61 62 66" {...common} />
      </>;

    case "laughing":
      // closed happy arc eyes + wide open laugh mouth
      return <>
        <Path d="M26 46 Q35 34 44 46" {...common} />
        <Path d="M56 46 Q65 34 74 46" {...common} />
        <Path d="M30 58 Q50 82 70 58 Q50 68 30 58 Z" fill={stroke} stroke="none" />
      </>;

    case "mind-melting":
      // spiral eyes + wobbly mouth
      return <>
        <Path d="M35 45 m-8,0 a8,8 0 1,1 16,0 a5,5 0 1,1 -10,0 a2.5,2.5 0 1,1 5,0" {...common} strokeWidth={4} />
        <Path d="M65 45 m-8,0 a8,8 0 1,1 16,0 a5,5 0 1,1 -10,0 a2.5,2.5 0 1,1 5,0" {...common} strokeWidth={4} />
        <Path d="M30 64 Q38 56 46 64 T62 64 T78 64" {...common} />
      </>;

    case "warm-fuzzy":
      // simple dot eyes + soft content smile
      return <>
        <Circle cx={35} cy={45} fill={stroke} r={5} />
        <Circle cx={65} cy={45} fill={stroke} r={5} />
        <Path d="M35 60 Q50 72 65 60" {...common} />
      </>;

    case "edge-of-seat":
      // wide alert eyes + small tense mouth
      return <>
        <Circle cx={35} cy={46} r={10} {...common} strokeWidth={5} />
        <Circle cx={35} cy={46} fill={stroke} r={3.5} stroke="none" />
        <Circle cx={65} cy={46} r={10} {...common} strokeWidth={5} />
        <Circle cx={65} cy={46} fill={stroke} r={3.5} stroke="none" />
        <Circle cx={50} cy={68} r={4.5} {...common} strokeWidth={5} />
      </>;

    case "zoned-out":
      // sleepy half-lidded eyes + zzz + flat mouth
      return <>
        <Path d="M27 46 Q35 50 43 46" {...common} />
        <Path d="M57 46 Q65 50 73 46" {...common} />
        <Path d="M40 66 L60 66" {...common} />
        <Path d="M70 24 L82 24 L70 34 L82 34" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} />
      </>;

    case "wide-awake":
      // raised brows + wide round eyes + small open mouth
      return <>
        <Path d="M24 32 Q35 24 46 32" {...common} strokeWidth={5} />
        <Path d="M54 32 Q65 24 76 32" {...common} strokeWidth={5} />
        <Circle cx={35} cy={46} r={9} {...common} strokeWidth={5} />
        <Circle cx={35} cy={46} fill={stroke} r={3} stroke="none" />
        <Circle cx={65} cy={46} r={9} {...common} strokeWidth={5} />
        <Circle cx={65} cy={46} fill={stroke} r={3} stroke="none" />
        <Circle cx={50} cy={68} r={4} {...common} strokeWidth={5} />
      </>;

    case "spiraling":
      // dizzy X eyes + wavy mouth
      return <>
        <Path d="M26 38 L44 52 M44 38 L26 52" {...common} strokeWidth={5} />
        <Path d="M56 38 L74 52 M74 38 L56 52" {...common} strokeWidth={5} />
        <Path d="M28 66 Q36 58 44 66 T60 66 T76 66" {...common} />
      </>;

    case "delulu":
      // heart eyes + small dreamy smile
      return <>
        <Path d="M35 41 C31 35 22 37 22 45 C22 51 30 56 35 60 C40 56 48 51 48 45 C48 37 39 35 35 41 Z" fill={stroke} stroke="none" />
        <Path d="M65 41 C61 35 52 37 52 45 C52 51 58 56 65 60 C70 56 78 51 78 45 C78 37 69 35 65 41 Z" fill={stroke} stroke="none" />
        <Path d="M40 68 Q50 74 60 68" {...common} />
      </>;

    case "brain-rot":
      // asymmetric dazed eyes + tongue-out open mouth
      return <>
        <Circle cx={35} cy={44} fill={stroke} r={5} />
        <Path d="M57 45 L73 45" {...common} />
        <Path d="M34 60 Q50 74 66 60 Z" fill={stroke} stroke="none" />
        <Path d="M44 70 Q50 82 56 70 Z" fill={stroke} stroke="none" opacity={0.55} />
      </>;

    default:
      return <>
        <Circle cx={35} cy={45} fill={stroke} r={5} />
        <Circle cx={65} cy={45} fill={stroke} r={5} />
        <Path d="M35 62 Q50 72 65 62" {...common} />
      </>;
  }
}
