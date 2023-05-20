/**
 * Class to handle template spreadsheet
 * @param ss GoogleAppsScript.Spreadsheet.Spreadsheet object
 * @returns TemplateSpreadsheet object
 */
class TemplateSpreadsheet {
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet;

    static subjectRow: number = 2;
    static bodyRow: number = 3;
    constructor(ss) {
        this.ss = ss;
    }

    /**
     * Get the template from the template spreadsheet. It will let you get a specific template by name and type.
     * @param templateName Name of the template you want
     * @param template_type Each template can have multiple types. 
     * @returns Object containing the subject, body, and attachments of the template.
     */
    getTemplate(templateName: string, template_type: string): Template {
        //Confirm template sheet exists.
        let templateSheet = this.ss.getSheetByName(templateName);
        if (!templateSheet) {
            throw new Error(`Template sheet ${templateName} not found.`);
        }

        let template ={};

        // find column of template type
        let templateTypeColumn = templateSheet.getRange(1, 1, 1, templateSheet.getLastColumn()).getValues()[0].indexOf(template_type) + 1;
        console.log("Found templateTypeColumn: " + templateTypeColumn);
        // Get attachments
        let attachments: string[] = [];
        if (templateSheet.getLastRow() < 4) {
            console.log("No attachments IDs found in template sheet " + templateName + " and type " + template_type);
        } else {
            let attachmentsRange = templateSheet.getRange(4, templateTypeColumn, templateSheet.getLastRow()-3, 1).getValues();
            //Loop through all cells in attachments range and add them to attachments array
            if (attachmentsRange.length > 0) {
                attachments = attachmentsRange.map((row) => {
                    row[0] 
                }).filter((attachment) => attachment != "");
            }
        }


        return new Template(
            templateSheet.getRange(TemplateSpreadsheet.bodyRow, templateTypeColumn).getValue(),
            templateSheet.getRange(TemplateSpreadsheet.subjectRow, templateTypeColumn).getValue(),
            attachments);


    }
}