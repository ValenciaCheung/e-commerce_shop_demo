const { execSync } = require('child_process');

try {
  console.log('开始运行测试...');
  const result = execSync('npm test', { encoding: 'utf8', stdio: 'pipe' });
  console.log('测试结果:');
  console.log(result);
} catch (error) {
  console.log('测试执行完成，结果:');
  console.log(error.stdout);
  if (error.stderr) {
    console.log('错误信息:');
    console.log(error.stderr);
  }
}