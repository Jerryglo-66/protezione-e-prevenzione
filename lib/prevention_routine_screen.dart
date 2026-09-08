import 'package:flutter/material.dart';

class PreventionRoutineScreen extends StatefulWidget {
  const PreventionRoutineScreen({super.key});

  @override
  State<PreventionRoutineScreen> createState() => _PreventionRoutineScreenState();
}

class _PreventionRoutineScreenState extends State<PreventionRoutineScreen> {
  int _currentStep = 0;

  final List<Map<String, String>> _preventionSteps = [
    {
      'title': '1. Decompressione: Child\'s Pose',
      'duration': '45 secondi',
      'desc': 'Allunga la colonna mantenendo il bacino sui talloni.',
    },
    {
      'title': '2. Mobilità: Gatto-Cammello',
      'duration': '10 ripetizioni',
      'desc': 'Mobilizza la schiena in coordinazione con la respirazione.',
    },
    {
      'title': '3. Stabilità: Bird Dog',
      'duration': '10 per lato',
      'desc': 'Mantieni l\'addome attivo e il bacino allineato.',
    },
    {
      'title': '4. Rinforzo: Ponte Glutei',
      'duration': '12 ripetizioni',
      'desc': 'Spingi sui talloni ed attiva la catena posteriore.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Routine Prevenzione Schiena'),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            LinearProgressIndicator(
              value: (_currentStep + 1) / _preventionSteps.length,
              color: Colors.teal,
            ),
            const SizedBox(height: 24),
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _preventionSteps[_currentStep]['title']!,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Chip(
                      label: Text(_preventionSteps[_currentStep]['duration']!),
                      backgroundColor: Colors.teal.shade50,
                    ),
                    const SizedBox(height: 16),
                    Text(_preventionSteps[_currentStep]['desc']!),
                  ],
                ),
              ),
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: _currentStep > 0
                      ? () => setState(() => _currentStep--)
                      : null,
                  child: const Text('Precedente'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.teal),
                  onPressed: _currentStep < _preventionSteps.length - 1
                      ? () => setState(() => _currentStep++)
                      : () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Routine completata!')),
                          );
                        },
                  child: Text(
                    _currentStep == _preventionSteps.length - 1
                        ? 'Concludi'
                        : 'Prossimo',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
