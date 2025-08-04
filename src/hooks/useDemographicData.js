import { useState, useCallback } from "react";
import { getDemographicData } from "../utils/getDemographicData";
import { useAppContext } from "../AppContext";

const useDemographicData = () => {
  const [demographicData, setDemographicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAppContext();

  const fetchData = useCallback(
    async (latitude, longitude) => {
      setLoading(true);
      try {
        const data = await getDemographicData(latitude, longitude);

        const facts = [
          data.TOTPOP && `Total Population 👥: ${data.TOTPOP}`,
          data.MP06005a_B &&
            `Volunteers 👐: ${data.MP06005a_B} volunteered last year`,
          data.MP26001h_B &&
            `Pet Owners 🐾: ${data.MP26001h_B} (out of ${data.TOTHH}) households have pets`,
          data.MARRIED_CY &&
            `Married Adults 💍: ${data.MARRIED_CY} are married (out of the ${
              data.TOTPOP - (data.POP0_CY + data.POP5_CY + data.POP10_CY)
            } who are 15+ years old)`,
          data.BACHDEG_CY &&
            `Educated Residents 🎓: ${
              data.BACHDEG_CY
            } have at least a bachelor's degree (out of the ${
              data.TOTPOP -
              (data.POP0_CY +
                data.POP5_CY +
                data.POP10_CY +
                data.POP15_CY +
                data.POP20_CY)
            } who are 25+ years old)`,
        ].filter(Boolean);

        const newBadges = [];

        const marriedPercentage =
          (data.MARRIED_CY /
            (data.TOTPOP - (data.POP0_CY + data.POP5_CY + data.POP10_CY))) *
          100;
        if (marriedPercentage >= 40) {
          dispatch({ type: "EARN_BADGE", payload: "Love is in the Air" });
          newBadges.push({
            text: "Love is in the Air",
            color: "#e91e63",
            description:
              "Awarded to areas where 40% or more of the population aged 15+ is married.",
          });
        }

        const scholarPercentage =
          (data.BACHDEG_CY /
            (data.TOTPOP -
              (data.POP0_CY +
                data.POP5_CY +
                data.POP10_CY +
                data.POP15_CY +
                data.POP20_CY))) *
          100;
        if (scholarPercentage >= 30) {
          dispatch({ type: "EARN_BADGE", payload: "Scholar Town" });
          newBadges.push({
            text: "Scholar Town",
            color: "#3f51b5",
            description:
              "Awarded to areas where 30% or more of the population aged 25+ have a bachelor's degree or higher.",
          });
        }

        if (data.TOTPOP < 5000) {
          newBadges.push({
            text: "Small Population Area",
            color: "#4caf50",
            description:
              "Awarded to areas with a small population size (less than 5,000 people).",
          });
        } else if (data.TOTPOP >= 5000 && data.TOTPOP <= 25000) {
          newBadges.push({
            text: "Medium Population Area",
            color: "#ff9800",
            description:
              "Awarded to areas with a medium population size (5,000 - 25,000 people).",
          });
        } else if (data.TOTPOP > 25000) {
          newBadges.push({
            text: "Large Population Area",
            color: "#2196f3",
            description:
              "Awarded to areas with a large population size (more than 25,000 people).",
          });
        }

        const petOwnershipPercentage = (data.MP26001h_B / data.TOTHH) * 100;
        if (petOwnershipPercentage > 50) {
          newBadges.push({
            text: "Pet Lovers Paradise",
            color: "#9c27b0",
            description:
              "Awarded to areas where more than 50% of households own pets.",
          });
        }

        const volunteerPercentage = (data.MP06005a_B / data.POP20_CY) * 100;
        if (volunteerPercentage > 30) {
          newBadges.push({
            text: "Charitable Community",
            color: "#f44336",
            description:
              "Awarded to areas where more than 30% of adults have volunteered in the last 12 months.",
          });
        }

        setDemographicData({ funFact: facts, badges: newBadges });
        return { funFact: facts, badges: newBadges };
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { demographicData, loading, error, fetchData };
};

export default useDemographicData;
