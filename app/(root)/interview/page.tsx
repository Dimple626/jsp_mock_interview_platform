
import Agent from "@/components/Agent";

const Page = async () => {
    // 🔕 Auth temporarily removed for deployment
    const user = {
        name: "Guest User",
        id: "guest-id",
        profileURL: null,
    };

    return (
        <>
            <h3>Interview generation</h3>

            <Agent
                userName={user.name}
                userId={user.id}
                type="generate"
            />
        </>
    );
};

export default Page;

