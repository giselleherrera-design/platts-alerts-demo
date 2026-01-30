import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { Report } from '../../types/alerts';

interface ReportListProps {
  reports: Report[];
  maxVisible?: number;
  showExpand?: boolean;
}

const ReportList: React.FC<ReportListProps> = ({
  reports,
  maxVisible = 6,
  showExpand = true,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const visibleReports = expanded ? reports : reports.slice(0, maxVisible);
  const hasMore = reports.length > maxVisible;

  return (
    <View style={styles.container}>
      {visibleReports.map((report, index) => (
        <View
          key={report.id}
          style={[
            styles.reportItem,
            index % 2 === 1 && styles.highlightedRow,
          ]}
        >
          <Text style={styles.reportName} numberOfLines={1}>
            {report.name}
          </Text>
        </View>
      ))}
      {showExpand && hasMore && (
        <Text
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? '▲ Show less' : `▼ Show ${reports.length - maxVisible} more`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  reportItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  highlightedRow: {
    backgroundColor: colors.surface,
  },
  reportName: {
    ...typography.body2,
    color: colors.link,
  },
  expandButton: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default ReportList;
