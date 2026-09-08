// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:il_mio_test/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    expect(find.text('Routine Prevenzione Schiena'), findsOneWidget);
    expect(find.text('1. Decompressione: Child\'s Pose'), findsOneWidget);

    await tester.tap(find.text('Prossimo'));
    await tester.pump();

    expect(find.text('2. Mobilità: Gatto-Cammello'), findsOneWidget);
  });
}