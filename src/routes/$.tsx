import { createFileRoute } from "@tanstack/react-router";
import NotFound from "@/components/Feedback/NotFound";

// Catch-all route for 404 pages
export const Route = createFileRoute("/$")({
	component: NotFoundPage,
});

function NotFoundPage() {
	return <NotFound />;
}
