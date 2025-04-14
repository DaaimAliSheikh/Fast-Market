import { Text } from "@/components/ui/text";

const HighlightText = ({
  text,
  highlight,
  numberOfLines = 1,
}: {
  text: string;
  highlight: string;
  numberOfLines?: number;
}) => {
  if (!highlight) {
    return (
      <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
        {text}
      </Text>
    );
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail">
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} className="bg-yellow-200">
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
};

export default HighlightText;
