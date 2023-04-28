class Templater {
    private subject_template: string;
    private body_template: string;

    constructor(subject_template: string, body_template: string) {
        this.subject_template = subject_template;
        this.body_template = body_template;
    }
    
    /**
     * Render a specific template with the given data
     * @param template template string to be rendered
     * @param data data to be used
     * @returns string with the template rendered
     */
    private render(template: string, data): string {
        return template.replace(/{{\s*([^}]+)\s*}}/g, (match, p1) => {
            return data[p1];
        });
    }

    /**
     * Take the data and render the email
     * @param data This is a data object with the name of the fields mathcing the template fields and the values being the values to be rendered
     * @returns A string[] with the first element being the subject and the second being the body
     */
    public render_email(data): string[] {
        return [this.render(this.subject_template, data),
        this.render(this.body_template, data)];
    }
}