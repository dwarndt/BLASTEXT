[[Installation (For Chrome)]]
1: Navigate to chrome extension page (chrome://extensions/)
2: In upper-right corner toggle on "developer mode"
3: Select "Load Unpacked"
4: Navigate to ../BLASTESTv1/src and click select folder

[[Usage]]
The program should automatically modify valid BLAST Result pages

[For single entries]
	1: Click "Copy" in the last column of the blast result
	2: In excel paste into first cell of row
	3: In paste dropdown select "Use Text Import Wizard"
	4: Choose option "Delimited" and select next
	5: Uncheck the "Space" delimiter option and check "Other", type "@" (without quotes) in the feild and select finish

[For bulk entries]
	0:*Code is still a little buggy, open the extension menu from the toolbar and check if any data is left over from previous entries, if so, click "clear table"
	1:Click the "Save" button in the last column of the relevant blast result
	2:Repeat for every sample, be sure to check that the table in the extension menu is updating.
	3:Click "Copy table" to commit the table to the clipboard
	4:Paste to excel, be sure to remove source formatting