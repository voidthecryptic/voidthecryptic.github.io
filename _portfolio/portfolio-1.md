---
title: "Audio Amplifier using BJT"
excerpt: "The amplifier is simulated in LTspice and marks the beginning of my electronics.<br/><img src='/images/var_gain.gif' width='500' height='300' alt='3D Amplifier PCB'>"
collection: portfolio
category: academic
layout: custom
tags: [electronics, amplifier, bjt]
header:
order: 1
date: 22/11/2024
toc: true
toc_sticky: true
classes: wide

---
## Introduction

Amplifiers comprise the most basic piece in modern electronics and feature high application in almost any scheme requiring signal processing. This project explores the design of a two-stage common emitter amplifier with a push-pull configuration, realized using widely available NPN and PNP BJTs (BC547B, BC557B) [file:1].

The goal was to design a small-signal amplifier for audio signal processing, bridging theoretical principles with practical circuit implementation. While amplifiers may seem simple, achieving optimal performance requires mastering component interaction, frequency response, and operating point stability.

<div style="aspect-ratio: 16 / 9; width: 60%;">
  <img src="/images/amplifier_3d_view.png" style="width:100%; height:100%; object-fit:contain;">
</div>

## Design Concept

### The BJT as an Amplifier
The core of this project is the Bipolar Junction Transistor (BJT). We utilized both NPN and PNP types to control the flow of current between collector and emitter terminals based on the base current. The project implements a **Class AB** amplifier design, which operates in a hybrid mode between Class A and Class B.

*   **Class AB Operation:** Allows transistors to conduct for just over half a cycle. This minimizes the crossover distortion found in Class B amplifiers while offering greater efficiency than Class A amplifiers.
*   **Push-Pull Configuration:** The output stage uses complementary NPN and PNP transistors. The NPN conducts for the positive half of the waveform and the PNP for the negative half, efficiently driving the load.

![Collector Current Graph for Push-Pull Configuration](/images/push-pull-graph.png)

## Circuit Design and Simulation (LTspice)

We used LTspice to simulate the circuit before hardware implementation. This allowed us to analyze the transient behavior and frequency response.

### Schematic Details
The circuit consists of:
*   **Input Stage (Q1, Q2):** NPN transistors (BC547B) acting as a pre-amplifier to boost the small input signal [file:1].
*   **Output Stage (Q3, Q4):** A complementary pair of PNP transistors (BC556B) in a push-pull configuration to drive the speaker load.
*   **Biasing Network:** Resistors R1, R2, and R9 set the operating point (Q-point) to ensure the transistors operate in their active region [file:1].

![LTspice Schematic Diagram](/images/ltspice-schematic.png)

### Simulation Results
The transient analysis confirmed that the circuit amplifies the 20mV input sine wave into a stronger output signal capable of driving an 8Ω load.

![Input vs Output Voltage Waveforms](/images/voltage-waveforms.png)

**Frequency Response:**
The bandwidth was calculated to be **161 kHz** ($f_H - f_L$), providing a 16dB gain across the audio range (20Hz - 20kHz), which is more than sufficient for high-fidelity audio applications [file:1].

![Frequency Response Graph](/images/frequency-response.png)

### SPICE Code
Below is the netlist used for the simulation:

```spice
* Audio Amplifier Circuit
R1 b1 0 100k 
R2 e1 N001 470 
R3 e3 c1 33k 
R5 b2 b4 330 
R6 out 0 8 
R7 e4 e1 10k 
R8 out b4 1.2k 
C1 N001 0 1µ 
C2 out e4 100µ 
C3 b1 in 10µ 
R9 e3 b1 63k 
Q1 c1 b1 e1 0 BC547B 
Q2 c2 b2 e4 0 BC547B 
Q3 b2 c1 e3 0 BC556B 
Q4 0 b4 e4 0 BC556B 
V1 e3 0 9 
V2 in 0 SINE (0 20m 120) AC 0 0 
.tran 200ms 
.end

```
---
