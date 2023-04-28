class Emailer {
    private template: Templater;

    constructor(subject_template: string, body_template: string) {
        this.template = new Templater(subject_template, body_template);
    }


    /**
     * Take the data and render the email and send it to recipients
     * @param email string[] of email addresses
     * @param data An object containing the data to be rendered
     * @param attachments A string[] of file ids to be attached to the email. These are assumed to be google docs and will be rendered into pdfs.
     */
    public sendEmail(emails: string[], data, attachments: string[]) {
        let rendered_email = this.template.render_email(data);
        
        let pdf_attachments: GoogleAppsScript.Base.Blob[] = [];

        if (attachments.length > 0) {
            pdf_attachments = this.getAttachments(attachments);
        }

        GmailApp.sendEmail(emails.join(","), rendered_email[0], rendered_email[1], { attachments: pdf_attachments });
    }

    /**
     * Takes a string[] of google drive ids and returns a GoogleAppsScript.Base.Blob[] of pdfs
     * @param attachments Google drive ids of the files to be attached
     * @returns GoogleAppsScript.Base.Blob[] of pdfs.
     */
    private getAttachments(attachments: string[]) {
        return attachments.map((attachment) => {
            return DriveApp.getFileById(attachment).getAs("applciation/PDF");
        });
    }
}

function newEmailer(subject_template, body_template) {
    return new Emailer(subject_template, body_template);
}
