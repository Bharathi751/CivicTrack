// Duplicate Detection Engine as per Section 17 of project specification:
// Duplicate score = 0.4 * location_similarity + 0.3 * category_similarity + 0.3 * text_similarity

export function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function getLocationSimilarity(distanceMeters) {
  if (distanceMeters <= 50) return 1.0;
  if (distanceMeters <= 150) return 0.9;
  if (distanceMeters <= 300) return 0.75;
  if (distanceMeters <= 500) return 0.55;
  if (distanceMeters <= 800) return 0.3;
  if (distanceMeters <= 1200) return 0.15;
  return 0.0;
}

function getCategorySimilarity(catId1, catId2) {
  if (catId1 === catId2) return 1.0;
  // Related civic categories (e.g., Road and Hazard, or Drainage and Water)
  const relatedPairs = [
    [1, 6], // Roads and Public Safety/Hazards
    [4, 5], // Water Supply and Drainage
    [2, 5], // Garbage and Drainage (often clogged drains)
  ];
  const isRelated = relatedPairs.some(
    ([a, b]) => (catId1 === a && catId2 === b) || (catId1 === b && catId2 === a)
  );
  return isRelated ? 0.4 : 0.0;
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'near', 'of',
  'to', 'for', 'with', 'from', 'by', 'it', 'has', 'have', 'there', 'very', 'been'
]);

function tokenize(text) {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );
}

function getTextSimilarity(textA, textB) {
  const setA = tokenize(textA);
  const setB = tokenize(textB);
  if (setA.size === 0 || setB.size === 0) return 0.0;

  let intersectionCount = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersectionCount++;
  });

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount > 0 ? intersectionCount / unionCount : 0.0;
}

export function computeDuplicateScore(issueA, issueB) {
  const distance = calculateDistanceInMeters(
    issueA.latitude,
    issueA.longitude,
    issueB.latitude,
    issueB.longitude
  );

  const locSim = getLocationSimilarity(distance);
  const catSim = getCategorySimilarity(issueA.category_id, issueB.category_id);
  
  const textA = `${issueA.title} ${issueA.description}`;
  const textB = `${issueB.title} ${issueB.description}`;
  const textSim = getTextSimilarity(textA, textB);

  // Formula as specified in PDF Page 9:
  // Duplicate score = 0.4 * location + 0.3 * category + 0.3 * text
  const rawScore = 0.4 * locSim + 0.3 * catSim + 0.3 * textSim;
  const scorePercent = Math.min(100, Math.round(rawScore * 100));

  return {
    scorePercent,
    rawScore,
    distanceMeters: distance,
    locSim: Math.round(locSim * 100),
    catSim: Math.round(catSim * 100),
    textSim: Math.round(textSim * 100),
    isCandidate: scorePercent >= 45
  };
}

// Find all candidate duplicates for a given issue against all existing issues
export function findDuplicateCandidates(targetIssue, allIssues) {
  return allIssues
    .filter((issue) => issue.issue_id !== targetIssue.issue_id && issue.status !== 'rejected')
    .map((candidate) => {
      const match = computeDuplicateScore(targetIssue, candidate);
      return {
        candidate,
        ...match
      };
    })
    .filter((res) => res.isCandidate)
    .sort((a, b) => b.scorePercent - a.scorePercent);
}
