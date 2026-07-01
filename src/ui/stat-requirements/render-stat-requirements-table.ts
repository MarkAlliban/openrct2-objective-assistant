import { UI_VALUE_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants";
import { renderSortingButtons, TTableColumn } from "../../helpers/render-sorting-buttons";
import { TSortTable } from "../open-window";

export const renderStatRequirementsTable = (
	y: number,
	clickRow: Function,
	sortBy: TSortTable,
	tableWidth = WINDOW_WIDTH,
) => {
	// Get the columns to display
	const cols: TTableColumn[] = [
		{
			header: "Ride",
			canSort: true,
		},
		{
			header: "Type",
			canSort: true,
		},
		{
			header: "Reqs",
			width: 40,
			canSort: true,
		},
	];

	// Add auto-width to any that don't have width specified
	const usedWidth = cols.reduce((a, c) => a + (c.width || 0), 0);
	const colsToShare = cols.reduce((a, c) => a + (c.width ? 0 : 1), 0);
	if (colsToShare)
		cols.forEach((c) => {
			if (!c.width) c.width = (tableWidth - 10 - usedWidth) / colsToShare;
		});

	// Make sorting buttons
	const widgets = renderSortingButtons(cols, sortBy, y);

	// Add the rides list
	widgets.push({
		name: "listRides",
		type: "listview",
		x: 5,
		y: y + UI_VALUE_HEIGHT,
		width: tableWidth - 10,
		height: WINDOW_HEIGHT - y - UI_VALUE_HEIGHT - 5,
		isStriped: true,
		canSelect: false,
		columns: cols,
		items: [],
		onClick: (row: number, col: number) => clickRow(row, col),
	});

	return widgets;
};
