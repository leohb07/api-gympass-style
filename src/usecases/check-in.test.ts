import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CheckInUseCase } from "./check-in.usecase";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins.repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.error";
import { MaxDistanceError } from "./errors/max-distance.error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'TypeScript Gym',
      phone: '',
      description: '',
      latitude: -22.7024598,
      longitude: -46.9798305,
    })

    vi.useFakeTimers();
  })

  afterEach(() => {
    vi.useRealTimers();
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7024598,
      userLongitude: -46.9798305,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 7, 6, 20, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7024598,
      userLongitude: -46.9798305,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.7024598,
        userLongitude: -46.9798305,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 7, 6, 20, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7024598,
      userLongitude: -46.9798305,
    });

    vi.setSystemTime(new Date(2024, 7, 7, 20, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7024598,
      userLongitude: -46.9798305,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  })

  it('should be able to check in on distance gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'TypeScript Gym',
      phone: '',
      description: '',
      latitude: new Decimal(-22.7163397),
      longitude: new Decimal(-46.8832948),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.7024598,
        userLongitude: -46.9798305,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  })
})
