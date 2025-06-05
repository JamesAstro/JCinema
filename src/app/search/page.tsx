import { Suspense } from "react";
import LayoutContainer from "../components/LayoutContainer";
import LoadingLight from "../components/Loading/LoadingLight";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <LayoutContainer>
      <Suspense fallback={<LoadingLight />}>
        <SearchContent />
      </Suspense>
    </LayoutContainer>
  );
}
