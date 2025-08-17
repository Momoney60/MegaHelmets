export const HELMET_STAGE_WIDTH = 1100;
export const HELMET_STAGE_HEIGHT = 700;

// These paths were hand-tuned to resemble a realistic Riddell-style side-view helmet.
// Coordinates are based on a 1000x600 design space, then scaled to the stage size.
// Shell path is drawn clockwise starting from the jaw near the facemask.
export const SHELL_OUTLINE_PATH = `
M 205 505
C 170 470, 150 430, 145 395
C 135 335, 150 270, 180 220
C 210 170, 260 130, 320 105
C 375 82, 440 70, 520 70
C 600 70, 670 83, 730 110
C 805 144, 865 194, 905 255
C 935 301, 952 356, 955 405
C 959 462, 946 505, 918 545
C 890 585, 850 612, 802 628
C 775 636, 725 642, 665 645
L 640 645
C 625 645, 610 636, 605 622
C 600 608, 600 595, 608 580
L 620 555
C 620 555, 560 552, 500 548
C 430 543, 365 532, 310 516
C 275 506, 240 510, 205 505
Z`;

// Opening around the face where the facemask connects
export const SHELL_FACE_CUTOUT_PATH = `
M 640 645
C 660 645, 690 640, 705 635
C 745 620, 770 595, 780 575
C 792 552, 790 532, 777 520
C 770 513, 760 511, 748 513
C 736 515, 712 525, 700 532
C 688 538, 676 547, 664 558
C 651 569, 642 583, 635 598
C 628 613, 625 630, 640 645 Z`;

// Ear hole
export const EAR_HOLE = { x: 410, y: 430, radius: 28 };

// Rivet placements (screws)
export const RIVETS: Array<{ x: number; y: number }> = [
	{ x: 350, y: 335 },
	{ x: 500, y: 315 },
	{ x: 600, y: 350 },
	{ x: 300, y: 500 },
];

// A stylized facemask built with a series of strokes
export const FACEMASK_BARS: Array<{ points: number[]; width: number }> = [
	// Jawline bar
	{ points: [640, 600, 720, 590, 820, 575, 900, 560], width: 14 },
	// Lower horizontal
	{ points: [640, 560, 730, 550, 830, 540, 925, 530], width: 12 },
	// Mid horizontal
	{ points: [650, 520, 740, 512, 840, 505, 930, 498], width: 12 },
	// Upper visor bar
	{ points: [662, 485, 750, 480, 845, 478, 940, 477], width: 10 },
	// Vertical connectors
	{ points: [735, 545, 735, 590], width: 10 },
	{ points: [830, 530, 830, 575], width: 10 },
];

// Clip path describing the paintable shell (excluding the face cutout area)
// Used to clip decals, stripes, and patterns so they stay on the shell
export const buildShellClipFunc = (scale = 1) => (ctx: CanvasRenderingContext2D) => {
	const p = new Path2D(SHELL_OUTLINE_PATH);
	const cut = new Path2D(SHELL_FACE_CUTOUT_PATH);
	// Outline solid area
	ctx.save();
	ctx.scale(scale, scale);
	ctx.fill(p);
	// Punch out the face opening by using destination-out with globalCompositeOperation
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fill(cut);
	ctx.restore();
};