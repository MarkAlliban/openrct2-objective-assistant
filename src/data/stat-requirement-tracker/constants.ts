export const SPECIAL_PIECES = {
	special: new Set([
		68, // Water coaster straight track
		81, // Water coaster bend L
		82, // Water coaster bend R
		211, // Reverser L
		212, // Reverser R
		201, // Mini golf hole A
		202, // Mini golf hole B
		203, // Mini golf hole C
		204, // Mini golf hole D
		205, // Mini golf hole E
	]),

	complete: new Set([
		40, // Vertical loop left
		41, // Vertical loop right
	]),
	in: new Set([
		52, // Inline twist left (in)
		53, // Inline twist right (in)
		56, // Small half loop (in)
		58, // Corkscrew right (in)
		59, // Corkscrew left (in)
		174, // Barrel roll left (in)
		175, // Barrel roll right (in)
		183, // Large half loop right (in)
		184, // Large half loop left (in)
		207, // Quarter loop (in)
		267, // Large corkscrew right (in)
		268, // Large corkscrew left (in)
		271, // Medium half loop right (in)
		272, // Medium half loop left (in)
		275, // Zero-G roll left (in)
		276, // Zero-G roll right (in)
		279, // Large zero-G roll left (in)
		280, // Large zero-G roll right (in)
	]),
	out: new Set([
		54, // Inline twist left (out)
		55, // Inline twist right (out)
		57, // Small half loop (out)
		60, // Corkscrew left (out)
		61, // Corkscrew right (out)
		176, // Barrel roll left (out)
		177, // Barrel roll right (out)
		185, // Large half loop left (out)
		186, // Large half loop right (out)
		208, // Quarter loop (out)
		269, // Large corkscrew left (out)
		270, // Large corkscrew right (out)
		273, // Medium half loop left (out)
		274, // Medium half loop right (out)
		277, // Zero-G roll left (out)
		278, // Zero-G roll right (out)
		281, // Large zero-G roll left (out)
		282, // Large zero-G roll right (out)
	]),
};
