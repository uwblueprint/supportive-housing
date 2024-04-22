import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx';
import { LogRecord } from "../types/LogRecordTypes";

export enum DocType {
  DOCX = "docx",
  CSV = "csv",
} 

const downloadBlob = (blob: Blob, type: DocType): void => {

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Get date for file name
    // "fr-CA" formats the date into YYYY-MM-DD
    const dateToday = new Date();
    const dateTodayString = dateToday
      .toLocaleString("fr-CA", { timeZone: "America/Toronto" })
      .substring(0, 10);

    link.setAttribute("download", `log_records_${dateTodayString}.${type}`);
    document.body.appendChild(link);
    link.click();

    // Cleanup created object
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export const convertLogsToDOCX = async (data: LogRecord[]): Promise<boolean> => {

  try {
    // Create a table to display log records
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Datetime')] }),
            new TableCell({ children: [new Paragraph('Tenants')] }),
            new TableCell({ children: [new Paragraph('Note')] }),
            new TableCell({ children: [new Paragraph('Employee')] }),
            new TableCell({ children: [new Paragraph('Attn Tos')] }),
            new TableCell({ children: [new Paragraph('Tags')] }),
            new TableCell({ children: [new Paragraph('Flagged')] }),
            new TableCell({ children: [new Paragraph('Building')] }),
          ],
        }),
        ...data.map((record) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(record.datetime)] }),
              new TableCell({ children: [new Paragraph(record.residents.join(', '))] }),
              new TableCell({ children: [new Paragraph(record.note)] }),
              new TableCell({ children: [new Paragraph(`${record.employee.firstName} ${record.employee.lastName}`)] }),
              new TableCell({ children: [new Paragraph(record.attnTos.join(', '))] }),
              new TableCell({ children: [new Paragraph(record.tags.join(', '))] }),
              new TableCell({ children: [new Paragraph(record.flagged ? 'Yes' : 'No')] }),
              new TableCell({ children: [new Paragraph(record.building.name)] }),
            ],
          })
        ),
      ],
    });

    // Create a new document with the table
    const doc = new Document({
      sections: [
        {
          children: [table],
        }
      ]
    });

    const blob = await Packer.toBlob(doc)
    downloadBlob(blob, DocType.DOCX)

    return true

  } catch (error) {
    console.log("Docx creation failed: ", error)

    return false
  }
};

export const convertLogsToCSV = (data: LogRecord[]): boolean => {

  try {
    const csvRows = [];

    const headers = [
      'Datetime',
      'Tenants',
      'Note',
      'Employee',
      'Attn Tos',
      'Tags',
      'Flagged',
      'Building'
    ];
    csvRows.push(headers.join(","));
    data.forEach((log: LogRecord) => {
      const logCSV = {
        datetime: `"${log.datetime}"`,
        tenants: `"${log.residents.join(", ")}"`,
        note: `"${log.note.replace(/"/g, '""')}"`,
        employee: `"${log.employee.firstName} ${log.employee.lastName}"`,
        attnTos: log.attnTos != null ? `"${log.attnTos.join(", ")}"` : "",
        tags: log.tags != null ? `"${log.tags.join(", ")}"` : "",
        flagged: log.flagged,
        building: `"${log.building.name}"`,
      };
      const values = Object.values(logCSV).join(",");
      csvRows.push(values);
    });
    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, DocType.CSV)

    return true;
  } catch {
    return false;
  }
};