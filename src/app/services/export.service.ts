import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Export data to CSV format
   * @param data Array of objects to export
   * @param filename Name of the file (without extension)
   * @param excludeColumns Array of column names to exclude from export
   */
  exportToCSV(data: any[], filename: string, excludeColumns: string[] = ['actions']): void {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    // Get all unique keys from the data, excluding specified columns
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!excludeColumns.includes(key.toLowerCase())) {
          allKeys.add(key);
        }
      });
    });

    const headers = Array.from(allKeys);
    
    // Create CSV content
    let csvContent = '';
    
    // Add headers
    csvContent += headers.map(header => this.escapeCSVField(this.formatHeader(header))).join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        return this.escapeCSVField(this.formatValue(value));
      });
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    this.downloadCSV(csvContent, filename);
  }

  /**
   * Export data to Excel format (CSV with Excel-friendly formatting)
   * @param data Array of objects to export
   * @param filename Name of the file (without extension)
   * @param excludeColumns Array of column names to exclude from export
   */
  exportToExcel(data: any[], filename: string, excludeColumns: string[] = ['actions']): void {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    // Get all unique keys from the data, excluding specified columns
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!excludeColumns.includes(key.toLowerCase())) {
          allKeys.add(key);
        }
      });
    });

    const headers = Array.from(allKeys);
    
    // Create Excel-friendly CSV content
    let csvContent = '\uFEFF'; // BOM for Excel UTF-8 recognition
    
    // Add headers
    csvContent += headers.map(header => this.escapeCSVField(this.formatHeader(header))).join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        return this.escapeCSVField(this.formatValue(value));
      });
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    this.downloadCSV(csvContent, filename, 'xlsx');
  }

  /**
   * Format header names to be more readable
   */
  private formatHeader(header: string): string {
    return header
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Format values for CSV export
   */
  private formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }

  /**
   * Escape CSV fields that contain commas, quotes, or newlines
   */
  private escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
  }

  /**
   * Download CSV content as file
   */
  private downloadCSV(csvContent: string, filename: string, extension: string = 'csv'): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.${extension}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Export filtered data (for components with search/filter functionality)
   */
  exportFilteredData(allData: any[], filteredData: any[], filename: string, excludeColumns: string[] = ['actions']): void {
    const dataToExport = filteredData.length > 0 ? filteredData : allData;
    this.exportToCSV(dataToExport, filename, excludeColumns);
  }
}