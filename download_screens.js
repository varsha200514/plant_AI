const fs = require('fs');
const https = require('https');

const screens = [
  { name: 'Dashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzYxNWQxNTQ1ZTc0OTRlMWQ5OTM1Yjg3NmUyNTk5ZmZhEgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Medicines', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I1NTliZjZmZDMwMzQ0MWVhNWYzOTc0ODY0NjUxM2I5EgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Weather_and_Shops', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzk3MTkwYzBmNThmMzRjNWRiN2I0ZWJhMjgyYThkZTQ1EgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Diagnostic_Lab', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JjMDY2Y2VlZmYyYjQ5Mzk4NWFhMmVlM2M4ZGNjYWY3EgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Plant_Library', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzExZWY0MzU1NzYxZjRlYjk5YWYwYWYyN2NjMGNlOGYyEgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Product_Settings', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg3MjAxYzIyZjEyNDRkMDM4MWZkOGMwYjBkMzA4ODhiEgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' },
  { name: 'Login_Page', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAxN2UxNjFlZjJjMjQ0ZTNiYTdiNDAwZjE4NjA3ZTJlEgsSBxC_iPnZgQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDU1NDkwMzMwNTY5NTA1NDk3MQ&filename=&opi=89354086' }
];

if (!fs.existsSync('.docs')) {
  fs.mkdirSync('.docs');
}

screens.forEach(screen => {
  https.get(screen.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(`.docs/${screen.name}.html`, data);
      console.log(`Downloaded ${screen.name}`);
    });
  }).on('error', err => console.log('Error:', err.message));
});
