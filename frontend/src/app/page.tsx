import Landing from "@/components/Landing";
import MainLayout from "@/components/layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout isPublic>
      <Landing />
    </MainLayout>
  );
}
