$ts = [int](Get-Date -UFormat %s)
$email = "test+$ts@example.com"
$username = "user$ts"
$body = @{ firstName='Test'; lastName='User'; email=$email; username=$username; password='Passw0rd!'; businessName='ACME'; phoneNumber='1234567890'; province='ON' } | ConvertTo-Json
Write-Host "Registering user: $email"
curl -i -X POST http://localhost:3000/api/auth/register/employer -H "Content-Type: application/json" -d $body -c cookies.txt
Write-Host '--- /api/auth/me ---'
curl -i -X GET http://localhost:3000/api/auth/me -b cookies.txt
Write-Host '--- POST /api/jobs ---'
$job = @{ 
  title='Test Job'
  company='ACME'
  city='Toronto'
  province='ON'
  employmentType='Full-time'
  salary='50000'
  salaryPeriod='year'
  adDurationDays=90
  category='Tech'
  jobPostingDate=(Get-Date -Format o)
  descriptionHtml='Test job description'
  howToApply=@{ byEmail=$true; email='hr@example.com' }
} | ConvertTo-Json -Depth 5
curl -i -X POST http://localhost:3000/api/jobs -H "Content-Type: application/json" -d $job -b cookies.txt
