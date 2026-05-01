export async function GET() {
  return Response.json({
    stacks: {},
    purposes: {},
    focuses: {},
    newWorks: [],
    updatedWorks: [],
    newUsers: []
  });
}
