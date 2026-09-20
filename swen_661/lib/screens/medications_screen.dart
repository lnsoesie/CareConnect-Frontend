import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/medication_provider.dart';

class MedicationsScreen extends ConsumerWidget {
  const MedicationsScreen({super.key});

  static const Color careConnectBlue = Color(0xFF2C67BA);
  static const Color takenStatusBackground = Color(0xFFE5F7F4);
  static const Color takenStatusText = Color(0xFF26766D);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final takenMedications = ref.watch(medicationTakenProvider);

    return Scaffold(
      backgroundColor: Colors.white,

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(22, 20, 22, 140),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Page title
              const Text(
                'Medications',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: careConnectBlue,
                ),
              ),

              const SizedBox(height: 80),

              // Search field
              TextField(
                decoration: InputDecoration(
                  labelText: 'Search medications',
                  hintText: 'Enter a medication name to search',
                  prefixIcon: const Icon(Icons.search),
                  contentPadding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 16,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: Colors.grey.shade300),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Lisinopril
              takenMedications.contains('Lisinopril')
                  ? const TakenMedicationCard(
                      name: 'Lisinopril',
                      dosage: '10 mg',
                      instructions: 'Take 1 tablet once daily',
                      takenTime: 'Taken just now',
                    )
                  : const MedicationCard(
                      name: 'Lisinopril',
                      dosage: '10 mg',
                      instructions: 'Take 1 tablet once daily',
                      nextDose: 'Next Dose 09:00 AM',
                    ),

              const SizedBox(height: 12),

              // Fingolimod
              // Fingolimod
              takenMedications.contains('Fingolimod')
                  ? const TakenMedicationCard(
                      name: 'Fingolimod',
                      dosage: '0.5 mg',
                      instructions: 'Take 1 tablet once daily',
                      takenTime: 'Taken just now',
                    )
                  : const MedicationCard(
                      name: 'Fingolimod',
                      dosage: '0.5 mg',
                      instructions: 'Take 1 tablet once daily',
                      nextDose: 'Next Dose 09:00 AM',
                    ),

              const SizedBox(height: 12),

              /*// Humira
              const MedicationCard(
                name: 'Humira',
                dosage: '40 mg/0.4 ml',
                instructions: 'Inject once every other week',
                nextDose: 'Next Dose Mon 09/07',
              ), */
              const SizedBox(height: 20),

              // Taken Today heading
              Text(
                'TAKEN TODAY',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade600,
                ),
              ),

              const SizedBox(height: 10),

              // Aspirin
              const TakenMedicationCard(
                name: 'Aspirin',
                dosage: '81 mg',
                instructions: 'Take 1 tablet once daily',
                takenTime: 'Taken at 8:04 AM',
              ),

              const SizedBox(height: 80),
            ],
          ),
        ),
      ),

      // Bottom navigation
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 3,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: careConnectBlue,
        unselectedItemColor: Colors.black,
        iconSize: 28,
        selectedFontSize: 14,
        unselectedFontSize: 14,

        // Home navigation
        onTap: (index) {
          if (index == 0) {
            context.go('/home');
          } else if (index == 1) {
            context.go('/appointments');
          } else if (index == 2) {
            context.go('/messages');
          } else if (index == 4) {
            context.go('/profile');
          }
        },

        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Appointments',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.message_outlined),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.medication_outlined),
            label: 'Medications',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

// Active medication card
class MedicationCard extends ConsumerWidget {
  final String name;
  final String dosage;
  final String instructions;
  final String nextDose;

  const MedicationCard({
    super.key,
    required this.name,
    required this.dosage,
    required this.instructions,
    required this.nextDose,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Semantics(
      container: true,
      label: '$name, $dosage, $instructions, $nextDose',
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 135),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  dosage,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),

            Text(instructions, style: const TextStyle(fontSize: 16)),

            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: Text(nextDose, style: const TextStyle(fontSize: 15)),
                ),

                const SizedBox(width: 10),

                Semantics(
                  label: 'Mark $name as taken',
                  hint: 'Double tap after taking this medication',
                  button: true,
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () {
                        ref
                            .read(medicationTakenProvider.notifier)
                            .markAsTaken(name);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: MedicationsScreen.careConnectBlue,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(48, 48),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      child: const Text(
                        'Mark as Taken',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
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

// Medication that has already been taken
class TakenMedicationCard extends StatelessWidget {
  final String name;
  final String dosage;
  final String instructions;
  final String takenTime;

  const TakenMedicationCard({
    super.key,
    required this.name,
    required this.dosage,
    required this.instructions,
    required this.takenTime,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: '$name, $dosage, $instructions, $takenTime, Taken',
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 130),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  name,
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  dosage,
                  style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
                ),
              ],
            ),

            const SizedBox(height: 8),

            Text(
              instructions,
              style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
            ),

            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: Text(
                    takenTime,
                    style: TextStyle(fontSize: 15, color: Colors.grey.shade600),
                  ),
                ),

                Container(
                  constraints: const BoxConstraints(
                    minHeight: 44,
                    minWidth: 60,
                  ),
                  alignment: Alignment.center,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: MedicationsScreen.takenStatusBackground,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Taken',
                    style: TextStyle(
                      fontSize: 14,
                      color: MedicationsScreen.takenStatusText,
                      fontWeight: FontWeight.w600,
                    ),
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
