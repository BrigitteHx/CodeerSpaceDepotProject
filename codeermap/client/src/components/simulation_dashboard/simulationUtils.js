export const calculateCost = (prices, usage) =>
    prices.reduce((total, price, index) => total + price * usage[index], 0);
  
  // Function to calculate solar output based on form data
  export const calculateSolarOutput = (formData) => {
    const { panels, panelPower, sunshineHours, panelEfficiency, days = 15 } = formData;
    const panelEfficiencyFactor = panelEfficiency / 100;
    const panelPowerKw = panelPower / 1000;
    const sunshineHoursInHours = sunshineHours.map(duration => duration / 3600);
  
    const solarDailyOutput = sunshineHoursInHours.map((hours, index) => {
        const isPeakHour = index >= 10 && index <= 14; 
        const peakMultiplier = isPeakHour ? 1.5 : 1;
        const dailyOutput = panels * panelPowerKw * hours * panelEfficiencyFactor * peakMultiplier;
        return parseFloat(dailyOutput.toFixed(2));
    });
  
    return {
        solarDailyOutput,
        solar15DayOutput: parseFloat(solarDailyOutput.slice(0, days).reduce((sum, output) => sum + output, 0).toFixed(2)),
    };
  };
  
  
  // Function to calculate the results
  export const calculateResults = (results, sunshineData, dynamicPrices, hourlyUsage) => {
    if (!results || !sunshineData || sunshineData.length === 0) {
        console.error("Invalid input for results or sunshine data.");
        return null;
    }
  
    const totalEnergyUsage =
        results.energy_usage_method === "actual"
            ? results.custom_kwh_usage / 2
            : results.energy_usage_method === "high"
                ? 8 * results.residents * 15
                : results.energy_usage_method === "medium"
                    ? 5 * results.residents * 15
                    : 3 * results.residents * 15;
    const dailyEnergyUsage = totalEnergyUsage / 15;
  
    const solarOutput = calculateSolarOutput({
        panels: results.panels,
        panelPower: results.panel_power,
        sunshineHours: sunshineData.slice(0, 15),
        panelEfficiency: results.panel_efficiency,
    });
  
    const dailyEnergyCost = calculateCost(dynamicPrices, hourlyUsage);
    const totalEnergyCosts = dailyEnergyCost * 15;
  
    const fifteenDayPanelOutput = solarOutput.solarDailyOutput.reduce((sum, output) => sum + output, 0);
    const dailyPanelOutput = fifteenDayPanelOutput / 15;
  
    let totalSavings = 0;
    const dailySavingsList = solarOutput.solarDailyOutput.map((output, dayIndex) => {
        let dailySaving = 0;
        
        for (let hour = 0; hour < 24; hour++) {
          const hourUsage = hourlyUsage[hour];
          const hourPrice = dynamicPrices[hour];
          const hourSolar = output / 24;
      
          if (!isNaN(hourUsage) && !isNaN(hourPrice) && !isNaN(hourSolar)) {
              if (hourSolar >= hourUsage) {
                  dailySaving += hourUsage * hourPrice;
              } else {
                  dailySaving += hourSolar * hourPrice;
              }
          }
      }
  
        totalSavings += dailySaving;
        return { day: dayIndex + 1, savings: dailySaving.toFixed(2) };
    });
  
    const fifteenDaySavings = totalSavings.toFixed(2);
    const dailySavings = (totalSavings / 15).toFixed(2);
  
    return {
        fifteenDay: {
            energyUsage: totalEnergyUsage.toFixed(0),
            panelOutput: fifteenDayPanelOutput.toFixed(2),
            savings: fifteenDaySavings,
            overschot: (fifteenDayPanelOutput - totalEnergyUsage).toFixed(2),
            tekort: (totalEnergyUsage - fifteenDayPanelOutput).toFixed(2),
            energyCost: totalEnergyCosts.toFixed(2),
        },
        daily: {
            energyUsage: dailyEnergyUsage.toFixed(0),
            panelOutput: dailyPanelOutput.toFixed(2),
            savings: dailySavings,
            overschot: (dailyPanelOutput - dailyEnergyUsage).toFixed(2),
            tekort: (dailyEnergyUsage - dailyPanelOutput).toFixed(2),
            energyCost: dailyEnergyCost.toFixed(2),
            solarOutput: solarOutput.solarDailyOutput,
            savingsList: dailySavingsList,
        },
        solarOutput: solarOutput.solar15DayOutput,
    };
  };
  