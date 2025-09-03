import React from 'react';
import { ScrollView, Text, View } from 'react-native';

type Column<T> = { key: keyof T; title: string; width?: number | string; render?: (row: T) => React.ReactNode };

type Props<T> = {
  columns: Array<Column<T>>;
  data: Array<T>;
  emptyText?: string;
};

export function AppTable<T>({ columns, data, emptyText = 'Sin datos' }: Props<T>) {
  return (
    <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
      <ScrollView horizontal>
        <View style={{ minWidth: '100%' }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9' }}>
            {columns.map((c) => (
              <View key={String(c.key)} style={{ padding: 8, width: c.width ?? 140 }}>
                <Text style={{ fontWeight: '700', color: '#0f172a' }}>{c.title}</Text>
              </View>
            ))}
          </View>
          {data.length === 0 ? (
            <View style={{ padding: 12 }}>
              <Text style={{ color: '#64748b' }}>{emptyText}</Text>
            </View>
          ) : (
            data.map((row, idx) => (
              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e2e8f0' }}>
                {columns.map((c) => (
                  <View key={String(c.key)} style={{ padding: 8, width: c.width ?? 140 }}>
                    {c.render ? (
                      c.render(row)
                    ) : (
                      <Text style={{ color: '#0f172a' }}>{String(row[c.key])}</Text>
                    )}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}


