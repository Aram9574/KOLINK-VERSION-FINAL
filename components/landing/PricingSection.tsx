import React from "react";
import { Pricing } from "../ui/pricing-cards";
import Section from "@/components/ui/Section";
import { AppLanguage } from "../../types";

interface PricingSectionProps {
    language: AppLanguage;
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
    return (
        <Section id="pricing" withGrid>
             <Pricing currentPlanId={undefined} />
        </Section>
    );
};

export default PricingSection;
