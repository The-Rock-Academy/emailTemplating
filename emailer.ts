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
     * @param attachments_pdf A GoogleAppsScript.Base.Blob[] of pdfs to be attached to the email.
     */
    public sendEmail(emails: string[], data, attachments: string[] = [], attachments_pdf: GoogleAppsScript.Base.Blob[]=[], replyTo: string = "") {
        let rendered_email = this.template.render_email(data);
        if (attachments.length > 0) {
            attachments_pdf = attachments_pdf.concat(this.getAttachments(attachments));
        }

        console.log("Going to send email with " + attachments_pdf.length + " attachments")

        if (replyTo != "") {
            GmailApp.sendEmail(emails.join(","), rendered_email[0], rendered_email[1], { attachments: attachments_pdf, replyTo: replyTo });
        } else {
            GmailApp.sendEmail(emails.join(","), rendered_email[0], rendered_email[1], { attachments: attachments_pdf });
        }
    }

    /**
     * Takes a string[] of google drive ids and returns a GoogleAppsScript.Base.Blob[] of pdfs
     * @param attachments Google drive ids of the files to be attached
     * @returns GoogleAppsScript.Base.Blob[] of pdfs.
     */
    private getAttachments(attachments: string[]): GoogleAppsScript.Base.Blob[] {
        return attachments.map((attachment) => {
            return DriveApp.getFileById(attachment).getAs("application/PDF");
        });
    }
}

function newEmailer(subject_template, body_template) {
    return new Emailer(subject_template, body_template);
}
