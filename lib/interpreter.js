import fs from 'fs';
import yaml from 'js-yaml';
import ejs from 'ejs';
import readline from 'readline';

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

export async function build() {
  let data;
  if (!fs.existsSync('./portfolio.yaml')) {
    console.log('portfolio.yaml not found. Run "portfolio-gen edit" to create one.');
    return;
  } else {
    data = yaml.load(fs.readFileSync('./portfolio.yaml', 'utf8'));
  }

  const template = fs.readFileSync('./templates/default.ejs', 'utf8');
  const html = ejs.render(template, { data });

  fs.mkdirSync('./dist', { recursive: true });
  fs.writeFileSync('./dist/index.html', html);
  // Copy CSS if exists
  if (fs.existsSync('./templates/style.css')) {
    fs.copyFileSync('./templates/style.css', './dist/style.css');
  }
  // Copy assets if exists
  if (fs.existsSync('./assets')) {
    fs.cpSync('./assets', './dist/assets', { recursive: true });
  }
  console.log('✅ Portfolio built at ./dist/index.html');
}

export async function edit() {
  let data = {};
  if (fs.existsSync('./portfolio.yaml')) {
    data = yaml.load(fs.readFileSync('./portfolio.yaml', 'utf8')) || {};
  }

  // Basic Info
  data.name = await prompt(`Enter your name [${data.name || 'Jane Doe'}]: `) || data.name || 'Jane Doe';
  data.title = await prompt(`Enter your title [${data.title || 'Software Engineer'}]: `) || data.title || 'Software Engineer';
  data.tagline = await prompt(`Enter your tagline [${data.tagline || 'Building tools that make life easier.'}]: `) || data.tagline || 'Building tools that make life easier.';
  data.bio = await prompt(`Enter your bio [${data.bio || 'Passionate developer with a knack for building scalable web applications and delightful user experiences.'}]: `) || data.bio || 'Passionate developer with a knack for building scalable web applications and delightful user experiences.';
  data.email = await prompt(`Enter your email [${data.email || 'jane@example.com'}]: `) || data.email || 'jane@example.com';
  data.phone = await prompt(`Enter your phone [${data.phone || '+1-555-1234'}]: `) || data.phone || '+1-555-1234';
  data.location = await prompt(`Enter your location [${data.location || 'San Francisco, CA'}]: `) || data.location || 'San Francisco, CA';
  data.resume = await prompt(`Enter your resume file/link [${data.resume || 'resume.pdf'}]: `) || data.resume || 'resume.pdf';

  // Skills
  data.skills = data.skills || {};
  for (const category of ['Languages', 'Frameworks', 'Tools', 'Databases']) {
    const prev = data.skills[category] ? data.skills[category].join(', ') : '';
    const skillsInput = await prompt(`Enter ${category} (comma separated) [${prev}]: `);
    if (skillsInput) {
      data.skills[category] = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Projects
  data.projects = Array.isArray(data.projects) ? data.projects : [];
  let addMoreProj = await prompt('Do you want to edit/add projects? (y/n): ');
  if (addMoreProj.toLowerCase() === 'y') {
    data.projects = [];
    let addProj = true;
    while (addProj) {
      const title = await prompt('  Project title: ');
      const description = await prompt('  Project description: ');
      const tech = await prompt('  Project tech (comma separated): ');
      const link = await prompt('  Project source link: ');
      const image = await prompt('  Project image url: ');
      const demo = await prompt('  Project demo url: ');
      data.projects.push({
        title,
        description,
        tech: tech ? tech.split(',').map(s => s.trim()).filter(Boolean) : [],
        link,
        image,
        demo
      });
      addProj = (await prompt('Add another project? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Experience
  data.experience = Array.isArray(data.experience) ? data.experience : [];
  let addMoreExp = await prompt('Do you want to edit/add experience? (y/n): ');
  if (addMoreExp.toLowerCase() === 'y') {
    data.experience = [];
    let addExp = true;
    while (addExp) {
      const company = await prompt('  Company: ');
      const role = await prompt('  Role: ');
      const period = await prompt('  Period: ');
      const description = await prompt('  Description: ');
      const tech = await prompt('  Tech used (comma separated): ');
      data.experience.push({
        company,
        role,
        period,
        description,
        tech: tech ? tech.split(',').map(s => s.trim()).filter(Boolean) : []
      });
      addExp = (await prompt('Add another experience? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Education
  data.education = Array.isArray(data.education) ? data.education : [];
  let addMoreEdu = await prompt('Do you want to edit/add education? (y/n): ');
  if (addMoreEdu.toLowerCase() === 'y') {
    data.education = [];
    let addEdu = true;
    while (addEdu) {
      const school = await prompt('  School/University: ');
      const degree = await prompt('  Degree: ');
      const year = await prompt('  Year: ');
      const highlightsInput = await prompt('  Highlights (comma separated): ');
      data.education.push({
        school,
        degree,
        year,
        highlights: highlightsInput ? highlightsInput.split(',').map(s => s.trim()).filter(Boolean) : []
      });
      addEdu = (await prompt('Add another education entry? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Achievements
  data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
  let addMoreAch = await prompt('Do you want to edit/add achievements? (y/n): ');
  if (addMoreAch.toLowerCase() === 'y') {
    data.achievements = [];
    let addAch = true;
    while (addAch) {
      const title = await prompt('  Achievement title: ');
      const year = await prompt('  Year: ');
      const description = await prompt('  Description: ');
      data.achievements.push({ title, year, description });
      addAch = (await prompt('Add another achievement? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Testimonials
  data.testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
  let addMoreTest = await prompt('Do you want to edit/add testimonials? (y/n): ');
  if (addMoreTest.toLowerCase() === 'y') {
    data.testimonials = [];
    let addTest = true;
    while (addTest) {
      const name = await prompt('  Name: ');
      const role = await prompt('  Role: ');
      const quote = await prompt('  Quote: ');
      data.testimonials.push({ name, role, quote });
      addTest = (await prompt('Add another testimonial? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Social
  data.social = data.social || {};
  for (const platform of ['github', 'linkedin', 'twitter']) {
    const prev = data.social[platform] || '';
    const url = await prompt(`Enter your ${platform} URL [${prev}]: `);
    if (url) data.social[platform] = url;
  }

  // Blog
  data.blog = Array.isArray(data.blog) ? data.blog : [];
  let addMoreBlog = await prompt('Do you want to edit/add blog posts? (y/n): ');
  if (addMoreBlog.toLowerCase() === 'y') {
    data.blog = [];
    let addBlog = true;
    while (addBlog) {
      const title = await prompt('  Blog post title: ');
      const link = await prompt('  Blog post link: ');
      data.blog.push({ title, link });
      addBlog = (await prompt('Add another blog post? (y/n): ')).toLowerCase() === 'y';
    }
  }

  // Footer
  data.footer = await prompt(`Enter footer text [${data.footer || `© ${new Date().getFullYear()} ${data.name}`}]: `) || data.footer || `© ${new Date().getFullYear()} ${data.name}`;

  fs.writeFileSync('./portfolio.yaml', yaml.dump(data));
  console.log('✅ portfolio.yaml updated!');
}
