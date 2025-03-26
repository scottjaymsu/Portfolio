import {
    roundDownHour,
    addHours,
    generateTimeline,
    filterFlightsByRange,
    getEffectiveTime,
    getChartArrivalTime,
  } from "../components/TrafficOverview";
  
  describe("Traffic Overview Logic", () => {
    test("roundDownHour returns a date rounded to the start of the hour", () => {
      const date = new Date("2021-01-01T12:34:56");
      const rounded = roundDownHour(date);
      expect(rounded.getMinutes()).toBe(0);
      expect(rounded.getSeconds()).toBe(0);
      expect(rounded.getMilliseconds()).toBe(0);
    });
  
    test("addHours correctly adds the specified hours", () => {
      const date = new Date("2021-01-01T12:00:00");
      const result = addHours(date, 2);
      expect(result.getHours()).toBe(14);
    });
  
    test("generateTimeline returns an array of dates at hourly intervals", () => {
      const start = new Date("2021-01-01T00:00:00");
      const end = new Date("2021-01-01T05:00:00");
      const timeline = generateTimeline(start, end);
      // There should be 6 dates (inclusive of start and end)
      expect(timeline.length).toBe(6);
      expect(timeline[0].toISOString()).toBe(start.toISOString());
      expect(timeline[timeline.length - 1].toISOString()).toBe(end.toISOString());
    });
  
    test("getEffectiveTime returns rounded-down time for departures", () => {
      const flight = { etd: "2021-01-01T12:34:56" };
      const result = getEffectiveTime(flight, "etd", false);
      expect(result).toBe(new Date("2021-01-01T12:00:00").toISOString());
    });
  
    test("getEffectiveTime returns time +1 hour (then rounded down) for arrivals", () => {
      const flight = { eta: "2021-01-01T12:34:56" };
      // Adding one hour: 13:34:56, then rounded down is 13:00:00
      const result = getEffectiveTime(flight, "eta", true);
      expect(result).toBe(new Date("2021-01-01T13:00:00").toISOString());
    });
  
    test("filterFlightsByRange returns only flights within the given range", () => {
      const flights = [
        { etd: "2021-01-01T10:00:00" },
        { etd: "2021-01-01T12:00:00" },
        { etd: "2021-01-01T15:00:00" },
      ];
      const start = new Date("2021-01-01T11:00:00");
      const end = new Date("2021-01-01T16:00:00");
      const filtered = filterFlightsByRange(flights, "etd", start, end);
      expect(filtered.length).toBe(2);
      expect(filtered[0].etd).toBe("2021-01-01T12:00:00");
      expect(filtered[1].etd).toBe("2021-01-01T15:00:00");
    });
  
    test("cumulative parked count calculation works correctly", () => {
      // Simulate a timeline with four hours and a baseline parked count of 10.
      // Assume:
      // - At 13:00 there are 2 departures.
      // - At 14:00 there are 3 arrivals (which are used for parked adjustments).
      // Then adjustments per hour are:
      // 12:00: adjustment = 0 (baseline)
      // 13:00: adjustment = 0 - 2 = -2
      // 14:00: adjustment = 3 - 0 = +3
      // 15:00: adjustment = 0
      // Expected cumulative parked counts:
      // 12:00 -> 10; 13:00 -> 8; 14:00 -> 11; 15:00 -> 11
  
      const baselineParkedCount = 10;
      const timeline = [
        new Date("2021-01-01T12:00:00"),
        new Date("2021-01-01T13:00:00"),
        new Date("2021-01-01T14:00:00"),
        new Date("2021-01-01T15:00:00"),
      ];
      const timelineISO = timeline.map((t) => t.toISOString());
  
      // Set up effective departures and arrivals per timeline bucket.
      const effectiveDepartures = {
        [timelineISO[0]]: 0,
        [timelineISO[1]]: 2,
        [timelineISO[2]]: 0,
        [timelineISO[3]]: 0,
      };
      const effectiveArrivals = {
        [timelineISO[0]]: 0,
        [timelineISO[1]]: 0,
        [timelineISO[2]]: 3,
        [timelineISO[3]]: 0,
      };
  
      // Compute adjustments: (arrivals - departures) for each time slot.
      const adjustments = {};
      timeline.forEach((time) => {
        const iso = time.toISOString();
        adjustments[iso] =
          (effectiveArrivals[iso] || 0) - (effectiveDepartures[iso] || 0);
      });
  
      // Compute cumulative parked count using a forward simulation.
      const cumulativeParked = {};
      // Assume baseline is at index 0 (12:00)
      let cumulative = baselineParkedCount;
      for (let i = 0; i < timeline.length; i++) {
        const iso = timeline[i].toISOString();
        cumulative += adjustments[iso] || 0;
        cumulativeParked[iso] = cumulative;
      }
  
      expect(cumulativeParked[timelineISO[0]]).toBe(10); // 12:00
      expect(cumulativeParked[timelineISO[1]]).toBe(8);  // 13:00: 10 - 2
      expect(cumulativeParked[timelineISO[2]]).toBe(11); // 14:00: 8 + 3
      expect(cumulativeParked[timelineISO[3]]).toBe(11); // 15:00: no change
    });
  });
  