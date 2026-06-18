export const SPECIAL_PIECES = {
  special: new Set([
    68, // Water coaster straight track (kTEDFlatCovered)
    81, // Water coaster bend L (kTEDLeftQuarterTurn5TilesCovered)
    82, // Water coaster bend R (kTEDRightQuarterTurn5TilesCovered)
    211, // Reverser L (kTEDLeftReverser)
    212, // Reverser R (kTEDRightReverser)
    201, // Mini golf hole A (kTEDMinigolfHoleA)
    202, // Mini golf hole B (kTEDMinigolfHoleB)
    203, // Mini golf hole C (kTEDMinigolfHoleC)
    204, // Mini golf hole D (kTEDMinigolfHoleD)
    205, // Mini golf hole E (kTEDMinigolfHoleE)
  ]),
  inversions: new Set([
    40, // kTEDLeftVerticalLoop
    41, // kTEDRightVerticalLoop
    52, // kTEDLeftTwistDownToUp
    53, // kTEDRightTwistDownToUp
    56, // kTEDHalfLoopUp
    58, // kTEDLeftCorkscrewUp
    59, // kTEDRightCorkscrewUp
    174, // kTEDLeftBarrelRollUpToDown
    175, // kTEDRightBarrelRollUpToDown
    183, // kTEDLeftLargeHalfLoopUp
    184, // kTEDRightLargeHalfLoopUp
    187, // kTEDLeftFlyerTwistUp
    188, // kTEDRightFlyerTwistUp
    191, // kTEDFlyerHalfLoopUninvertedUp
    193, // kTEDLeftFlyerCorkscrewUp
    194, //	kTEDRightFlyerCorkscrewUp
    199, //	kTEDLeftHeartLineRoll
    200, //	kTEDRightHeartLineRoll
    207, //	kTEDUp90ToInvertedFlatQuarterLoop
    253, //	kTEDMultiDimUp90ToInvertedFlatQuarterLoop
    255, //	kTEDMultiDimInvertedUp90ToFlatQuarterLoop
    267, //	kTEDLeftLargeCorkscrewUp
    268, //	kTEDRightLargeCorkscrewUp
    271, //	kTEDLeftMediumHalfLoopUp
    272, //	kTEDRightMediumHalfLoopUp
    275, //	kTEDLeftZeroGRollUp
    276, //	kTEDRightZeroGRollUp
    279, //	kTEDLeftLargeZeroGRollUp
    280, //	kTEDRightLargeZeroGRollUp
    283, //	kTEDLeftFlyerLargeHalfLoopUninvertedUp
    284, //	kTEDRightFlyerLargeHalfLoopUninvertedUp
    289, //	kTEDLeftFlyerLargeHalfLoopUninvertedDown
    290, //	kTEDRightFlyerLargeHalfLoopUninvertedDown
    292, //	kTEDFlyerHalfLoopUninvertedDown
    345, //	kTEDLeftEighthDiveLoopUpToOrthogonal
    346, //	kTEDRightEighthDiveLoopUpToOrthogonal
  ]),
};
