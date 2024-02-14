export async function fetchIssueById(id)
{
  return fetch(`${window.location.origin}/rest/api/3/issue/${id}`)
        .then((response) => response.json())
        .then((data) => ({
                id: data['key'],
                title: data['fields']['summary'],
        }));
}