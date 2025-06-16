import * as XLSX from 'xlsx';
import { Order, OrderValidationResult } from '../types/order';

export class ExcelService {
  /**
   * Process an Excel file and extract order data
   */
  static async processExcelFile(file: File): Promise<OrderValidationResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet) as Record<string, any>[];

          const result = this.validateAndTransformRows(rows);
          resolve(result);
        } catch (error) {
          reject(new Error('Failed to process Excel file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read Excel file'));
      };

      reader.readAsBinaryString(file);
    });
  }

  /**
   * Validate rows and transform them into Order objects
   */
  private static validateAndTransformRows(rows: Record<string, any>[]): OrderValidationResult {
    const result: OrderValidationResult = {
      valid: [],
      invalid: []
    };

    rows.forEach((row) => {
      const errors: string[] = [];
      const orderNumber = row['order-number']?.toString();
      const trackingNumber = row['Tracking']?.toString();

      // Validate order number
      if (!orderNumber) {
        errors.push('Missing order number');
      } else if (!orderNumber.startsWith('#')) {
        errors.push('Order number must start with #');
      }

      // Validate tracking number
      if (!trackingNumber) {
        errors.push('Missing tracking number');
      }

      if (errors.length > 0) {
        result.invalid.push({
          orderNumber,
          trackingNumber,
          errors
        });
      } else {
        const order: Order = {
          orderNumber,
          trackingNumber,
          trackingLink: `https://parcelsapp.com/en/tracking/${trackingNumber}`,
          fulfilled: false,
          dateAdded: new Date(),
          lastUpdated: new Date()
        };
        result.valid.push(order);
      }
    });

    return result;
  }
} 