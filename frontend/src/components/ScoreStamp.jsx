// The "stamp" is the one distinctive visual idea in this UI: a fit score
// rendered like a reviewer's stamp on a paper resume, tilted slightly,
// colored by tier. Everything else in the app stays deliberately plain
// so this stays the thing your eye lands on.

export default function ScoreStamp({ score }) {
  let tier = "";
  if (score < 5) tier = "stamp--low";
  else if (score < 8) tier = "stamp--mid";

  return (
    <div className={`stamp ${tier}`} aria-label={`Fit score ${score} out of 10`}>
      <span className="stamp__score">{score}</span>
      <span className="stamp__max">/ 10</span>
    </div>
  );
}
