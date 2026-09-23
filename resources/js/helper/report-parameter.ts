import { Report } from '@/types/ro';

export function getReportParameter(report: Report, code: string) {
    return report.categories
        ?.flatMap((category) => category.parameters ?? [])
        .find((param) => param.code === code);
}